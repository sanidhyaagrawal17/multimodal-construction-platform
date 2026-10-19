import os
import sys
import json
from PIL import Image

# Import core pipeline functions from app.py
from app import (
    get_protected_key,
    call_gemini_multimodal,
    SAFETY_PROMPT,
    SAFETY_SYSTEM_PROMPT,
    build_unified_audit_findings,
    draw_dynamic_annotations,
    active_key,
    active_model_name
)

def run_test_on_image(image_path, test_name, output_image_path):
    print("=" * 60)
    print(f"RUNNING TEST: {test_name}")
    print(f"Image Source: {image_path}")
    print("=" * 60)
    
    if not os.path.exists(image_path):
        print(f"ERROR: Image path {image_path} does not exist.")
        return None

    img = Image.open(image_path)
    print(f"Loaded image size: {img.size}")
    
    # 1. Execute live inference with Gemini
    print(f"Calling Gemini with model: {active_model_name}...")
    raw_data = call_gemini_multimodal(img, SAFETY_PROMPT, system_instruction=SAFETY_SYSTEM_PROMPT)
    print("Raw Gemini Output:")
    print(json.dumps(raw_data, indent=2))
    
    # 2. Build Unified Audit Findings
    audit = build_unified_audit_findings(raw_data)
    print("\nAuthoritative Unified Audit Findings:")
    print(f"- Scene Type: {audit['scene_type']}")
    print(f"- Workers Detected: {audit['workers_detected']}")
    print(f"- PPE Compliance: {audit['ppe_status_text']} {audit['ppe_sub_text']}")
    print(f"- Hazard Score: {audit['hazard_score']} / 100")
    print(f"- Fall Risk Index: {audit['fall_risk_pct']}%")
    print(f"- Hazards Count: {len(audit['hazards'])}")
    
    print("\nDetailed Hazards List:")
    for idx, h in enumerate(audit['hazards'], 1):
        print(f"  {idx}. [{h['severity']}] {h['osha_standard']} ({h['subpart']}) — {h['short_label']}: {h['observation']}")
        
    print("\nActions List:")
    for idx, a in enumerate(audit['actions'], 1):
        print(f"  {idx}. {a}")
        
    # 3. Dynamic Visual Annotations
    if audit['scene_type'] != "non_construction" and len(audit.get("all_detections", [])) > 0:
        annotated = draw_dynamic_annotations(img, audit.get("all_detections", []))
    else:
        annotated = img
        
    annotated.save(output_image_path)
    print(f"\nSaved visual artifact to: {output_image_path}")
    return audit

if __name__ == "__main__":
    if len(sys.argv) > 2:
        img_p = sys.argv[1]
        name = sys.argv[2]
        out_p = sys.argv[3] if len(sys.argv) > 3 else f"D:\\downloads\\{name}.png"
        run_test_on_image(img_p, name, out_p)
    else:
        print("Usage: python test_suite.py <image_path> <test_name> [output_path]")
