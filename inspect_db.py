import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "backend" / "database.sqlite"

queries = {
    "poliklinik": "SELECT id, name, code, doctor_name FROM poliklinik ORDER BY id;",
    "patients": "SELECT id, name, nik, gender, birth_date, phone FROM patients ORDER BY name LIMIT 50;",
    "visits": "SELECT ticket_id, patient_id, poliklinik_id, queue_number, visit_date, visit_time, status FROM visits ORDER BY visit_date DESC, visit_time DESC LIMIT 50;",
}


def run_query(cursor, name, query):
    print(f"\n=== {name.upper()} ===")
    try:
        cursor.execute(query)
        rows = cursor.fetchall()
        if not rows:
            print("(no rows)")
            return
        for row in rows:
            print(row)
    except sqlite3.Error as exc:
        print(f"Error reading {name}: {exc}")


if __name__ == "__main__":
    print(f"Inspecting SQLite database: {DB_PATH}")

    if not DB_PATH.exists():
        raise SystemExit(f"Database file not found: {DB_PATH}")

    conn = sqlite3.connect(DB_PATH)
    try:
        cursor = conn.cursor()
        for name, query in queries.items():
            run_query(cursor, name, query)
    finally:
        conn.close()
        print("\nDone.")
