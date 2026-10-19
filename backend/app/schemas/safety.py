from typing import List, Optional, Literal
from pydantic import BaseModel, Field
from datetime import datetime

class PPEItem(BaseModel):
    item: str = Field(..., description="PPE item name (e.g. Hardhat, High-Vis Vest, Fall Protection Harness, Safety Boots, Eye Protection)")
    status: Literal["Compliant", "Violation", "Partial", "Not Applicable"] = Field(..., description="Compliance status")
    compliance_rate_pct: int = Field(..., ge=0, le=100, description="Estimated percentage compliance observed")
    notes: str = Field(..., description="Field observations regarding this PPE category")

class HazardItem(BaseModel):
    hazard_id: str = Field(..., description="Unique hazard identifier (e.g., HAZ-001)")
    category: str = Field(..., description="Hazard type (e.g., Fall Hazard, Scaffolding Instability, Electrical, Tripping Debris)")
    severity: Literal["Low", "Medium", "High", "Critical"] = Field(..., description="Risk severity tier")
    location: str = Field(..., description="Location or zone within the image frame")
    description: str = Field(..., description="Detailed description of the observed hazard")
    osha_standard: str = Field(..., description="Referenced OSHA or National Building Code standard")

class SafetyAnalysisRequest(BaseModel):
    project_name: Optional[str] = Field(default="Site Alpha", description="Construction project identifier")
    site_zone: Optional[str] = Field(default="General Work Area", description="Zone or floor level")
    image_base64: Optional[str] = Field(default=None, description="Base64 encoded image string if not uploaded via multipart")

class SafetyAnalysisResponse(BaseModel):
    project_name: str
    site_zone: str
    safety_score: int = Field(..., ge=0, le=100, description="Overall site safety score out of 100")
    overall_risk_level: Literal["Low", "Medium", "High", "Critical"]
    summary: str
    ppe_compliance: List[PPEItem]
    hazards_identified: List[HazardItem]
    corrective_actions: List[str]
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
