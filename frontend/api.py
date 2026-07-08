import requests
import os

BASE_URL = "http://127.0.0.1:8000"

# ==========================
# AUTH
# ==========================

def register(name, email, password, role, admin_secret=None):
 
    response = requests.post(
        f"{BASE_URL}/users/register",
        json={
            "name": name,
            "email": email,
            "password": password,
            "role": role,
            "admin_secret": admin_secret
        }
    )
 
    return response

def login(email, password):

    url = f"{BASE_URL}/users/login"

    data = {
        "username": email,
        "password": password
    }

    return requests.post(
        url,
        data=data
    )

def get_current_user(token):

    url = f"{BASE_URL}/users/me"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    return requests.get(
        url,
        headers=headers
    )

# ==========================
# JOBS
# ==========================

def create_job(token, job):

    url = f"{BASE_URL}/jobs/"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    return requests.post(
        url,
        json=job,
        headers=headers
    )


def get_jobs(token):

    url = f"{BASE_URL}/jobs/"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    return requests.get(
        url,
        headers=headers
    )


def get_job(job_id, token):

    url = f"{BASE_URL}/jobs/{job_id}"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    return requests.get(
        url,
        headers=headers
    )


def delete_job(job_id, token):

    url = f"{BASE_URL}/jobs/{job_id}"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    return requests.delete(
        url,
        headers=headers
    )


def update_job(job_id, token, job):

    url = f"{BASE_URL}/jobs/{job_id}"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    return requests.put(
        url,
        json=job,
        headers=headers
    )

# ==========================
# APPLICATIONS
# ==========================

def apply_job(job_id, token):

    url = f"{BASE_URL}/applications/"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    data = {
        "job_id": job_id
    }

    return requests.post(
        url,
        json=data,
        headers=headers
    )


def upload_resume(application_id, pdf_path, token):

    url = f"{BASE_URL}/applications/{application_id}/upload"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    files = {
        "file": open(pdf_path, "rb")
    }

    return requests.post(
        url,
        files=files,
        headers=headers
    )


def get_applicants(job_id, token):

    url = f"{BASE_URL}/applications/job/{job_id}"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    return requests.get(
        url,
        headers=headers
    )


def update_application_status(
    application_id,
    status,
    token
):

    url = f"{BASE_URL}/applications/{application_id}/status"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    data = {
        "status": status
    }

    return requests.put(
        url,
        json=data,
        headers=headers
    )


def get_my_applications(token):

    url = f"{BASE_URL}/applications/my"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    return requests.get(
        url,
        headers=headers
    )

def get_my_jobs(token):

    url = f"{BASE_URL}/jobs/my"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    return requests.get(
        url,
        headers=headers
    )

def get_applicants(job_id, token):

    url = f"{BASE_URL}/applications/job/{job_id}"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    return requests.get(
        url,
        headers=headers
    )


def update_application_status(
    application_id,
    status,
    token
):

    url = f"{BASE_URL}/applications/{application_id}/status"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    data = {
        "status": status
    }

    return requests.put(
        url,
        json=data,
        headers=headers
    )


def upload_resume_file(application_id, uploaded_file, token):

    url = f"{BASE_URL}/applications/{application_id}/upload"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    files = {
        "file": (
            uploaded_file.name,
            uploaded_file.getvalue(),
            "application/pdf"
        )
    }

    return requests.post(
        url,
        files=files,
        headers=headers
    )


def get_applicant_analysis(application_id, token):

    url = f"{BASE_URL}/applications/{application_id}/analysis"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    return requests.get(
        url,
        headers=headers
    )

def get_resume_bytes(resume_path):

    filename = os.path.basename(resume_path)

    url = f"{BASE_URL}/uploads/{filename}"

    return requests.get(url)

def get_recruiter_analytics(token):

    url = f"{BASE_URL}/applications/analytics"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    return requests.get(
        url,
        headers=headers
    )

def analyze_resume(pdf_path, job_description, token):

    with open(pdf_path, "rb") as file:

        files = {

            "file": file

        }

        data = {

            "job_description": job_description

        }

        headers = {

            "Authorization": f"Bearer {token}"

        }

        return requests.post(

            f"{BASE_URL}/resume/analyze",

            files=files,

            data=data,

            headers=headers

        )

def _auth_headers(token):
    return {"Authorization": f"Bearer {token}"}
 
 
def get_platform_stats(token):
    return requests.get(
        f"{BASE_URL}/admin/stats",
        headers=_auth_headers(token)
    )
 
 
def get_all_users(token):
    return requests.get(
        f"{BASE_URL}/admin/users",
        headers=_auth_headers(token)
    )
 
 
def update_user_role(user_id, role, token):
    return requests.patch(
        f"{BASE_URL}/admin/users/{user_id}/role",
        json={"role": role},
        headers=_auth_headers(token)
    )
 
 
def update_user_status(user_id, status, token):
    return requests.patch(
        f"{BASE_URL}/admin/users/{user_id}/status",
        json={"status": status},
        headers=_auth_headers(token)
    )
 
 
def delete_user(user_id, token):
    return requests.delete(
        f"{BASE_URL}/admin/users/{user_id}",
        headers=_auth_headers(token)
    )
 
 
def get_all_jobs(token):
    return requests.get(
        f"{BASE_URL}/admin/jobs",
        headers=_auth_headers(token)
    )
 
 
def delete_job_admin(job_id, token):
    return requests.delete(
        f"{BASE_URL}/admin/jobs/{job_id}",
        headers=_auth_headers(token)
    )
 
 
def get_error_logs(token, limit=50):
    return requests.get(
        f"{BASE_URL}/admin/logs",
        params={"limit": limit},
        headers=_auth_headers(token)
    )
 
 
def get_analytics(token):
    return requests.get(
        f"{BASE_URL}/admin/analytics",
        headers=_auth_headers(token)
    )