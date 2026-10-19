import pytest
import sys
import os
import importlib.util

# Explicitly import root app.py to avoid colliding with backend/app package
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
app_path = os.path.join(ROOT_DIR, "app.py")
spec = importlib.util.spec_from_file_location("root_streamlit_app", app_path)
root_app = importlib.util.module_from_spec(spec)
spec.loader.exec_module(root_app)

def test_iou_calculation_and_person_deduplication():
    """Verify that bounding box overlap correctly calculates IoU and eliminates duplicate phantom detections."""
    # Two identical boxes (100% overlap)
    box_a = [350, 248, 600, 372]
    box_b = [355, 250, 605, 375]
    
    iou = root_app.calculate_iou(box_a, box_b)
    assert iou > 0.85, f"Expected high IoU for nearly identical boxes, got {iou}"

    # Non-overlapping boxes
    box_c = [100, 100, 200, 200]
    box_d = [500, 500, 600, 600]
    assert root_app.calculate_iou(box_c, box_d) == 0.0

    # NMS Deduplication: 3 detections representing 2 real workers (W1 duplicated)
    raw_persons = [
        {"category": "person", "box_2d": [350, 248, 600, 372], "confidence": 0.95},
        {"category": "person", "box_2d": [352, 250, 598, 370], "confidence": 0.80}, # Duplicate of W1
        {"category": "person", "box_2d": [460, 138, 695, 273], "confidence": 0.92}  # W2 distinct
    ]
    deduped = root_app.deduplicate_person_detections(raw_persons, iou_threshold=0.35)
    assert len(deduped) == 2, f"Expected exactly 2 workers after NMS deduplication, got {len(deduped)}"

def test_canonical_osha_hazard_registry():
    """Verify OSHA standard lookup consistency across Subpart L, Subpart M, and Subpart E."""
    registry = root_app.OSHA_HAZARD_REGISTRY
    
    # Scaffold Fall Protection
    assert registry["scaffold_no_fall_arrest"]["standard"] == "OSHA 1926.451(g)(1)"
    assert registry["scaffold_no_fall_arrest"]["severity"] == "Critical"
    assert "Subpart L" in registry["scaffold_no_fall_arrest"]["subpart"]
    
    # Scaffold Guardrail System
    assert registry["scaffold_missing_guardrail"]["standard"] == "OSHA 1926.451(g)(4)(i)"
    assert registry["scaffold_missing_guardrail"]["is_scene_level"] is True
    
    # Head Protection
    assert registry["ppe_no_hardhat"]["standard"] == "OSHA 1926.100(a)"
    assert registry["ppe_unverified"]["standard"] == "OSHA 1926.100"

def test_scene_level_finding_suppression():
    """Verify that scene-level guardrail findings are suppressed from drawing to eliminate spatial variance."""
    raw_data = {
        "scene_type": "construction_active",
        "detections": [
            {"category": "person", "box_2d": [350, 248, 600, 372], "hazard_key": "scaffold_no_fall_arrest"},
            {"category": "person", "box_2d": [460, 138, 695, 273], "hazard_key": "scaffold_no_fall_arrest"},
            {"category": "hazard", "box_2d": [100, 100, 200, 200], "hazard_key": "scaffold_missing_guardrail"}
        ]
    }
    audit = root_app.build_unified_audit_findings(raw_data)
    
    # Total hazards must be 3 (2 workers + 1 scene guardrail finding)
    assert len(audit["hazards"]) == 3
    
    # Drawable detections must contain ONLY the 2 physical workers (scaffold box suppressed)
    assert len(audit["all_detections"]) == 2
    for det in audit["all_detections"]:
        assert det["category"] == "person"
        assert det.get("is_scene_level") is not True

def test_empty_scaffold_zero_hazards():
    """Verify that an unoccupied scaffold structure reports 0 active fall hazards and 0 risk score."""
    raw_empty = {
        "scene_type": "construction_empty",
        "detections": []
    }
    audit = root_app.build_unified_audit_findings(raw_empty)
    assert audit["workers_detected"] == 0
    assert len(audit["hazards"]) == 0
    assert audit["hazard_score"] == 0
    assert audit["fall_risk_pct"] == 0
    assert audit["ppe_status_text"] == "N/A"

def test_compliant_ground_worker():
    """Verify that a compliant worker on stable grade reports 100% PPE pass and low baseline score."""
    raw_compliant = {
        "scene_type": "construction_active",
        "ppe_status": "compliant",
        "detections": [
            {
                "category": "person",
                "hazard_key": "worker_compliant",
                "severity": "OK",
                "short_label": "Worker 1 · PPE Compliant",
                "box_2d": [300, 300, 700, 500]
            }
        ]
    }
    audit = root_app.build_unified_audit_findings(raw_compliant)
    assert audit["workers_detected"] == 1
    assert len(audit["hazards"]) == 0
    assert audit["hazard_score"] == 12
    assert audit["fall_risk_pct"] == 10
    assert "100% Pass" in audit["ppe_status_text"]
