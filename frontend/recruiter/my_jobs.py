import streamlit as st

from api import (
    get_my_jobs,
    delete_job
)


def show():

    st.title(" My Jobs")

    token = st.session_state.token

    response = get_my_jobs(token)

    if response.status_code != 200:

        st.error("Unable to fetch jobs.")

        return

    jobs = response.json()

    if len(jobs) == 0:

        st.info(
            "You haven't posted any jobs yet."
        )

        return

    st.success(
        f"{len(jobs)} Job(s) Posted"
    )

    st.divider()

    for job in jobs:

        with st.container(border=True):

            st.subheader(job["title"])

            st.write(
                f" Company: {job['company']}"
            )

            st.write(
                f" Location: {job['location']}"
            )

            st.write(
                f" Skills: {job['required_skills']}"
            )

            st.write(job["description"])

            c1, c2, c3 = st.columns(3)

            with c1:

                if st.button(
                    " Applicants",
                    key=f"view_{job['id']}"
                ):

                    st.session_state.selected_job = job

                    st.session_state.page = "Applicants"

                    st.rerun()

            with c2:

                if st.button(
                    " Edit",
                    key=f"e{job['id']}"
                ):

                    st.session_state.editing_job = job

                    st.session_state.page = "Edit Job"

                    st.rerun()

            with c3:

                if st.button(
                    "Delete",
                    key=f"d{job['id']}"
                ):

                    delete = delete_job(
                        job["id"],
                        token
                    )

                    if delete.status_code == 200:

                        st.success(
                            "Job deleted successfully."
                        )

                        st.rerun()

                    else:

                        st.error(
                            delete.json()["detail"]
                        )