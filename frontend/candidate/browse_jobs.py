import streamlit as st
from api import get_jobs, apply_job, get_my_applications

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

    applied_job_ids = {
        app["job"]["id"]
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

            if job["id"] in applied_job_ids:

                st.success(" Already Applied")

            else:

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

                        st.info(
                            "Go to Upload Resume to upload your CV."
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