import os
from fastapi.testclient import TestClient

from app.main import app
from app.dependencies import get_current_user
from app.config import settings
import os
from pypdf import PdfWriter


class DummyUser:
    id = '00000000-0000-0000-0000-000000000000'
    email = 'test@example.com'
    name = 'Test User'


client = TestClient(app)


def override_user():
    return DummyUser()


app.dependency_overrides[get_current_user] = override_user


def test_list_textbooks_ok():
    # ensure textbooks dir exists and a dummy PDF is present for testing
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    tbdir = os.path.join(repo_root, settings.TEXTBOOKS_FOLDER)
    os.makedirs(tbdir, exist_ok=True)

    dummy_path = os.path.join(tbdir, 'test_dummy.pdf')
    if not os.path.exists(dummy_path):
        w = PdfWriter()
        w.add_blank_page(200, 200)
        with open(dummy_path, 'wb') as f:
            w.write(f)

    r = client.get('/api/study/textbooks')
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)


def test_get_textbook_if_exists():
    r = client.get('/api/study/textbooks')
    assert r.status_code == 200
    data = r.json()

    if len(data) == 0:
        # nothing to do — no textbooks present in repository root
        return

    first = data[0]
    filename = first.get('filename')
    assert filename and filename.lower().endswith('.pdf')

    resp = client.get(f"/api/study/textbooks/{filename}")
    assert resp.status_code == 200
    # Should be a PDF content-type
    assert 'application/pdf' in resp.headers.get('content-type', '')


def test_import_textbook_creates_material():
    r = client.get('/api/study/textbooks')
    assert r.status_code == 200
    data = r.json()
    if not data:
        return

    filename = data[0]['filename']
    resp = client.post(f"/api/study/textbooks/import/{filename}")
    # Import should either return created material or existing material
    assert resp.status_code == 200
    json_resp = resp.json()
    assert 'title' in json_resp
    assert 'content' in json_resp
