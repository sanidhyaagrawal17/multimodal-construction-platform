import os
import sys
import time
from playwright.sync_api import sync_playwright

SCREENSHOT_DIR = r"D:\downloads"
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

console_errors = []
console_warnings = []

def run_e2e():
    print("=" * 60)
    print("STARTING PLAYWRIGHT END-TO-END AUTOMATED VERIFICATION")
    print(f"Target URL: http://127.0.0.1:5173")
    print(f"Screenshot Storage: {SCREENSHOT_DIR}")
    print("=" * 60)

    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        context = browser.new_context(
            viewport={"width": 1600, "height": 1000},
            device_scale_factor=1,
        )
        page = context.new_page()

        # Capture console messages
        def on_console(msg):
            if msg.type == "error":
                console_errors.append(msg.text)
                print(f"[CONSOLE ERROR] {msg.text}")
            elif msg.type == "warning":
                console_warnings.append(msg.text)

        page.on("console", on_console)
        page.on("pageerror", lambda exc: console_errors.append(str(exc)))

        # 1. Load Main Site Safety View
        print("\n[Step 1] Loading Main Page (Site Safety Inspector)...")
        page.goto("http://127.0.0.1:5173", wait_until="networkidle")
        time.sleep(1)

        title = page.title()
        print(f"  Page Title: '{title}'")
        assert "Multimodal Construction Intelligence" in title, f"Unexpected title: {title}"

        # Verify Key Safety Elements
        assert page.locator("text=Skyline Heights Tower B").is_visible(), "Project header not visible"
        assert page.locator("text=OSHA 1926.501(b)(1)").first.is_visible(), "Worker 1 Critical OSHA tag not visible"
        assert page.locator("text=Hardhat").first.is_visible(), "Hardhat tag not visible"
        assert page.locator("text=Worker 2 (Distant)").first.is_visible(), "Worker 2 unverified tag not visible"

        # Verify Stats Strip
        stats_text = page.locator("text=PPE Compliance:").locator("..").inner_text()
        print(f"  Stats Strip text: '{stats_text}'")
        assert "100% Pass" in stats_text, f"Unexpected PPE compliance text: {stats_text}"
        assert "1 of 1 assessable" in stats_text, f"Unexpected assessable text: {stats_text}"

        # Hover over Scaffold Opening yellow box to test tooltip interaction
        print("  Testing hover tooltip on yellow scaffold hazard box...")
        hazard_box = page.locator("[data-detection-id='det-3']").first
        if hazard_box.is_visible():
            hazard_box.hover()
            time.sleep(0.5)

        shot1 = os.path.join(SCREENSHOT_DIR, "playwright_01_safety_inspector.png")
        page.screenshot(path=shot1, full_page=False)
        print(f"  [SAVED SCREENSHOT] {shot1}")

        # 2. Test Crack Analysis Tab
        print("\n[Step 2] Testing 'Crack Analysis' Tab...")
        page.locator("button:has-text('Crack Analysis')").click()
        time.sleep(1)
        assert page.locator("text=ACI 318").first.is_visible(), "ACI 318 text not found in Crack Analyzer"
        assert page.locator("text=Shear Crack").first.is_visible(), "Shear Crack classification not visible"
        assert page.locator("text=2.4").first.is_visible(), "2.4mm estimated width not visible"
        
        shot2 = os.path.join(SCREENSHOT_DIR, "playwright_02_crack_analyzer.png")
        page.screenshot(path=shot2, full_page=False)
        print(f"  [SAVED SCREENSHOT] {shot2}")

        # 3. Test Project Planner Tab
        print("\n[Step 3] Testing 'Project Planner' Tab...")
        page.locator("button:has-text('Project Planner')").click()
        time.sleep(1)
        assert page.locator("text=Project Parameters").is_visible(), "Project Parameters not visible"
        assert page.locator("text=Critical Path").first.is_visible(), "Critical Path badges not visible"
        assert page.locator("text=Work Breakdown Structure").first.is_visible(), "WBS Breakdown not visible"

        shot3 = os.path.join(SCREENSHOT_DIR, "playwright_03_project_planner.png")
        page.screenshot(path=shot3, full_page=False)
        print(f"  [SAVED SCREENSHOT] {shot3}")

        # 4. Test Real Estate Valuer Tab
        print("\n[Step 4] Testing 'Real Estate Valuer' Tab...")
        page.locator("button:has-text('Real Estate Valuer')").click()
        time.sleep(1)
        assert page.locator("text=Property Specification").is_visible(), "Property Specification not visible"
        assert page.locator("text=FAIR MARKET APPRAISAL").first.is_visible(), "Appraisal summary not visible"
        assert page.locator("text=Cost & Land Equity Breakdown").first.is_visible(), "Cost breakdown not visible"

        shot4 = os.path.join(SCREENSHOT_DIR, "playwright_04_real_estate_valuer.png")
        page.screenshot(path=shot4, full_page=False)
        print(f"  [SAVED SCREENSHOT] {shot4}")

        # 5. Test Daily Site Assistant Tab
        print("\n[Step 5] Testing 'Daily Assistant' Tab...")
        page.locator("button:has-text('Daily Assistant')").click()
        time.sleep(1)
        assert page.locator("text=Daily Field Ingestion").is_visible(), "Field ingestion not visible"
        assert page.locator("text=Verified Progress Highlights").is_visible(), "Progress highlights not visible"
        assert page.locator("text=Next-Day Action Punch List").is_visible(), "Punch list not visible"

        shot5 = os.path.join(SCREENSHOT_DIR, "playwright_05_daily_site_assistant.png")
        page.screenshot(path=shot5, full_page=False)
        print(f"  [SAVED SCREENSHOT] {shot5}")

        # 6. Test Weather Advisor Tab
        print("\n[Step 6] Testing 'Weather Advisor' Tab...")
        page.locator("button:has-text('Weather Advisor')").click()
        time.sleep(1)
        assert page.locator("text=Meteorological Parameters").is_visible(), "Weather parameters not visible"
        assert page.locator("text=Trade Safeguards & Code Thresholds").is_visible(), "Trade safeguards not visible"

        shot6 = os.path.join(SCREENSHOT_DIR, "playwright_06_weather_advisor.png")
        page.screenshot(path=shot6, full_page=False)
        print(f"  [SAVED SCREENSHOT] {shot6}")

        # 7. Test Knowledge Bot Tab
        print("\n[Step 7] Testing 'Knowledge Bot' Tab...")
        page.locator("button:has-text('Knowledge Bot')").click()
        time.sleep(1)
        assert page.locator("text=Quick Inquiries:").is_visible(), "Knowledge Bot quick inquiries not visible"
        assert page.locator("text=ACI 318-19").first.is_visible(), "Citations not visible"

        # Ask a quick question
        print("  Submitting query to AI Knowledge Assistant...")
        quick_btn = page.locator("button:has-text('What is the minimum curing period')").first
        if quick_btn.is_visible():
            quick_btn.click()
            time.sleep(2)

        shot7 = os.path.join(SCREENSHOT_DIR, "playwright_07_knowledge_bot.png")
        page.screenshot(path=shot7, full_page=False)
        print(f"  [SAVED SCREENSHOT] {shot7}")

        # 8. Test Executive Dossier Modal
        print("\n[Step 8] Testing 'Executive Dossier' Modal...")
        dossier_btn = page.locator("button:has-text('Export Audit Report')").first
        dossier_btn.click()
        time.sleep(0.5)

        assert page.locator("text=Executive Construction Audit Dossier").is_visible(), "Dossier modal not open"
        shot8 = os.path.join(SCREENSHOT_DIR, "playwright_08_executive_dossier.png")
        page.screenshot(path=shot8, full_page=False)
        print(f"  [SAVED SCREENSHOT] {shot8}")

        # Close modal
        close_btn = page.locator("button:has(.lucide-x)").first
        if close_btn.is_visible():
            close_btn.click()
        else:
            page.keyboard.press("Escape")
        time.sleep(0.5)

        # 9. Test Demo State Switcher
        print("\n[Step 9] Testing Demo State Switcher in Footer...")
        page.locator("button:has-text('Site Safety')").click()
        time.sleep(0.5)

        for st in ["empty", "loading", "error", "results"]:
            btn = page.locator(f"footer button:has-text('{st}')").first
            btn.click()
            time.sleep(0.3)
            print(f"  Tested state: '{st}' -> OK")

        browser.close()

    print("\n" + "=" * 60)
    print("VERIFICATION COMPLETE")
    print(f"Console Errors: {len(console_errors)}")
    if console_errors:
        for err in console_errors:
            print(f"  - {err}")
    print(f"Console Warnings: {len(console_warnings)}")
    print(f"All 8 high-resolution screenshots saved to: {SCREENSHOT_DIR}")
    print("=" * 60)

    if console_errors:
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == "__main__":
    run_e2e()
