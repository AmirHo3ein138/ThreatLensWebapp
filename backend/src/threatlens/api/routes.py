"""Small JSON API; scan execution stays outside request threads."""

from typing import Literal

from fastapi import APIRouter, HTTPException, Query, Request
from fastapi.responses import Response
from pydantic import BaseModel, ConfigDict, Field, StrictBool, StrictStr

from threatlens import __version__
from threatlens.core.config import VERSION
from threatlens.core.providers.manager import REGISTRY
from threatlens.services.scans import QueueFull

router = APIRouter(prefix="/api")


class ScanInput(BaseModel):
    model_config = ConfigDict(extra="forbid")
    ioc: StrictStr = Field(min_length=1, max_length=8192)
    refresh: StrictBool = False


@router.get("/health")
def health():
    return {"status": "ok", "version": __version__, "engine_version": VERSION}


@router.get("/providers")
def providers(request: Request):
    config = request.app.state.scans.config
    return [
        {
            "id": key,
            "name": provider.name,
            "configured": bool(config.keys.get(key)),
            "supported_types": sorted(item.value for item in provider.SUPPORTED_TYPES),
        }
        for key, provider in REGISTRY.items()
    ]


@router.post("/scans", status_code=202)
def create_scan(body: ScanInput, request: Request):
    try:
        return request.app.state.scans.submit(body.ioc, refresh=body.refresh)
    except ValueError as exc:
        raise HTTPException(422, detail=str(exc)) from None
    except QueueFull:
        raise HTTPException(
            429, detail="The scan queue is full. Try again shortly.") from None


@router.get("/scans")
def list_scans(
    request: Request,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0, le=1_000_000),
):
    return request.app.state.scans.history.list(limit, offset)


@router.get("/scans/{scan_id}")
def get_scan(scan_id: str, request: Request):
    result = request.app.state.scans.history.get(scan_id)
    if result is None:
        raise HTTPException(404, detail="Scan not found.")
    return result


@router.get("/scans/{scan_id}/export")
def export_scan(scan_id: str, request: Request, format: Literal["json", "txt"] = "json"):
    history = request.app.state.scans.history
    scan = history.get(scan_id)
    if scan is None:
        raise HTTPException(404, detail="Scan not found.")
    if scan["status"] != "completed":
        raise HTTPException(409, detail="This scan has no completed report.")
    # Use generated UUID from the DB record, never a user-controlled filesystem path.
    return Response(
        content=history.export(scan["id"], format),
        media_type="application/json" if format == "json" else "text/plain",
        headers={
            "Content-Disposition": f'attachment; filename="threatlens-{scan["id"]}.{format}"'},
    )
