"""One bounded queue and one long-lived scanner for a local application."""

import logging
import queue
import threading

from filelock import FileLock

from threatlens.core.detector import IOCType, normalize_ioc
from threatlens.core.engine import Scanner
from threatlens.core.reporting import compact, save_report
from threatlens.core.security import sensitive_url
from threatlens.db.history import History

logger = logging.getLogger("threatlens.web")


class QueueFull(Exception):
    pass


class ScanService:
    def __init__(self, config, *, scanner_factory=Scanner, queue_size=16):
        if queue_size < 1:
            raise ValueError("Queue size must be positive")
        self.config = config
        self.report_directory = config.data_dir / "reports"
        config.data_dir.mkdir(parents=True, exist_ok=True)
        # One process owns provider quota state for this data directory.
        self._instance_lock = FileLock(str(config.data_dir / "web.lock"), timeout=0)
        self._instance_lock.acquire()
        try:
            self.history = History(config.data_dir / "history.sqlite3")
            self.scanner = scanner_factory(config)
            self.history.interrupt_unfinished()
        except Exception:
            self._instance_lock.release()
            raise
        self._queue = queue.Queue(maxsize=queue_size)
        self._submit_lock = threading.Lock()
        self._stopping = threading.Event()
        self._worker = threading.Thread(target=self._run, name="threatlens-scan", daemon=True)
        self._worker.start()

    def submit(self, value: str, *, refresh=False):
        try:
            ioc, ioc_type = normalize_ioc(value)
            if ioc_type == IOCType.URL and sensitive_url(ioc):
                raise ValueError("Sensitive URL")
        except (ValueError, UnicodeError):
            raise ValueError("Enter a valid IP, domain, URL or hash without credentials.") from None
        if refresh and self.config.offline:
            raise ValueError("Refresh is unavailable in offline mode.")
        with self._submit_lock:
            if self._stopping.is_set() or self._queue.full():
                raise QueueFull
            scan_id = self.history.create(ioc, ioc_type.value, refresh)
            self._queue.put_nowait((scan_id, ioc, refresh))
        return {"id": scan_id, "status": "queued"}

    def _run(self):
        while not self._stopping.is_set():
            try:
                scan_id, ioc, refresh = self._queue.get(timeout=0.1)
            except queue.Empty:
                continue
            try:
                self.history.start(scan_id)
                report = self.scanner.scan(
                    ioc, report_directory=self.report_directory, refresh=refresh
                )
                save_report(report, self.report_directory)
                self.history.complete(scan_id, report.to_dict(), compact(report))
            except Exception:
                # Do not expose URLs, keys, paths or raw exceptions in diagnostics.
                logger.error("Scan failed; diagnostic details omitted")
                try:
                    self.history.fail(
                        scan_id, "scan_failed", "The scan could not finish. Retry the scan."
                    )
                except Exception:
                    logger.error("Unable to update scan history; diagnostic details omitted")
            finally:
                self._queue.task_done()

    def close(self):
        with self._submit_lock:
            self._stopping.set()
        # Finish the active bounded provider calls; leave pending jobs interrupted.
        self._worker.join()
        try:
            self.history.interrupt_unfinished()
        finally:
            self._instance_lock.release()
