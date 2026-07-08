import streamlit as st
from api import get_jobs, apply_job, get_my_applications, upload_resume_file

def show():

    st.title(" Browse Jobs")

    token = st.session_state.token

    # ----------------------------
    # Load Jobs
    # ----------------------------

    jobs_response = get_jobs(token)

    if jobs_response.status_code != 200:
        st.error("Unable to load jobs.")
        return

    jobs = jobs_response.json()

    # ----------------------------
    # Load My Applications
    # ----------------------------

    app_response = get_my_applications(token)

    if app_response.status_code == 200:
        applications = app_response.json()
    else:
        applications = []

    applications_by_job = {
        app["job"]["id"]: app
        for app in applications
    }

    # ----------------------------
    # Search
    # ----------------------------

    search = st.text_input(
        " Search by Job Title or Company"
    )

    # ----------------------------
    # Location Filter
    # ----------------------------

    locations = sorted(
        list(
            set(job["location"] for job in jobs)
        )
    )

    selected_location = st.selectbox(
        " Filter by Location",
        ["All"] + locations
    )

    st.divider()

    filtered_jobs = []

    for job in jobs:

        if search:

            text = (
                job["title"] +
                job["company"]
            ).lower()

            if search.lower() not in text:
                continue

        if (
            selected_location != "All"
            and job["location"] != selected_location
        ):
            continue

        filtered_jobs.append(job)

    if len(filtered_jobs) == 0:

        st.info("No jobs found.")

        return

    # ----------------------------
    # Display Jobs
    # ----------------------------

    for job in filtered_jobs:

        with st.container(border=True):

            st.subheader(job["title"])

            st.write(f" **Company:** {job['company']}")

            st.write(f" **Location:** {job['location']}")

            st.write("### Description")

            st.write(job["description"])

            st.write("### Required Skills")

            st.info(job["required_skills"])

            st.divider()

            application = applications_by_job.get(job["id"])

            # --------------------------------
            # Not applied yet
            # --------------------------------

            if application is None:

                if st.button(
                    "Apply",
                    key=f"apply_{job['id']}"
                ):

                    response = apply_job(
                        job["id"],
                        token
                    )

                    if response.status_code == 200:

                        st.success(
                            "Application submitted successfully!"
                        )

                        st.rerun()

                    else:

                        try:
                            st.error(
                                response.json()["detail"]
                            )

                        except:
                            st.error(
                                "Application failed."
                            )

            # --------------------------------
            # Applied, resume already uploaded
            # --------------------------------

            elif application["resume_path"]:

                st.success(" Already Applied  •  Resume Uploaded")

            # --------------------------------
            # Applied, resume still needed
            # --------------------------------

            else:

                st.success(" Already Applied")

                st.warning(
                    "Your resume hasn't been uploaded for this application yet."
                )

                uploaded_file = st.file_uploader(
                    "Upload Resume (PDF)",
                    type=["pdf"],
                    key=f"resume_upload_{application['id']}"
                )

                if uploaded_file is not None:

                    if st.button(
                        "Upload Resume",
                        key=f"upload_btn_{application['id']}"
                    ):

                        upload_response = upload_resume_file(
                            application["id"],
                            uploaded_file,
                            token
                        )

                        if upload_response.status_code == 200:

                            st.success(
                                "Resume uploaded successfully!"
                            )

                            st.rerun()

                        else:

                            try:
                                st.error(
                                    upload_response.json()["detail"]
                                )

                            except:
                                st.error(
                                    "Resume upload failed."
                                )