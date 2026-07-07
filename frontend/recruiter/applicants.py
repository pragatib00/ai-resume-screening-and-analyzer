import base64
import streamlit as st

from api import (
    get_applicants,
    update_application_status,
    get_resume_bytes
)


def show():

    st.title("Applicants")

    if "selected_job" not in st.session_state:

        st.warning("Please select a job first.")
        return

    job = st.session_state.selected_job

    st.subheader(job["title"])
    st.write(f"{job['company']}")
    st.write(f"{job['location']}")

    st.divider()

    token = st.session_state.token

    response = get_applicants(
        job["id"],
        token
    )

    if response.status_code != 200:

        st.error("Unable to fetch applicants.")
        return

    applicants = response.json()

    if len(applicants) == 0:

        st.info("No applicants yet.")
        return

    for applicant in applicants:

        with st.container(border=True):

            # --------------------------
            # Candidate Info
            # --------------------------

            st.subheader(
                applicant["candidate"]["name"]
            )

            st.write(
                f"{applicant['candidate']['email']}"
            )

            # --------------------------
            # AI Match Score
            # --------------------------

            score = applicant["match_score"]

            st.metric(
                "AI Match Score",
                f"{score}%"
            )

            st.progress(score / 100)

            # --------------------------
            # Status
            # --------------------------

            status = applicant["status"]

            if status == "Pending":

                st.warning(
                    f"Status: {status}"
                )

            elif status == "Shortlisted":

                st.success(
                    f"Status: {status}"
                )

            else:

                st.error(
                    f"Status: {status}"
                )

            # --------------------------
            # Resume Viewer
            # --------------------------

            if applicant["resume_path"]:

                with st.expander("View Resume"):

                    resume_response = get_resume_bytes(
                        applicant["resume_path"]
                    )

                    if resume_response.status_code == 200:

                        pdf_bytes = resume_response.content

                        base64_pdf = base64.b64encode(
                            pdf_bytes
                        ).decode("utf-8")

                        pdf_display = f"""
                        <iframe
                            src="data:application/pdf;base64,{base64_pdf}"
                            width="100%"
                            height="700"
                            type="application/pdf">
                        </iframe>
                        """

                        st.markdown(
                            pdf_display,
                            unsafe_allow_html=True
                        )

                    else:

                        st.error(
                            "Unable to load resume."
                        )

            else:

                st.info(
                    "Candidate has not uploaded a resume."
                )

            # --------------------------
            # Recruiter Actions
            # --------------------------

            col1, col2 = st.columns(2)

            with col1:

                if st.button(
                    "Shortlist",
                    key=f"short_{applicant['id']}"
                ):

                    r = update_application_status(
                        applicant["id"],
                        "Shortlisted",
                        token
                    )

                    if r.status_code == 200:

                        st.success(
                            "Candidate shortlisted!"
                        )

                        st.rerun()

                    else:

                        st.error(
                            "Failed to update status."
                        )

            with col2:

                if st.button(
                    "Reject",
                    key=f"reject_{applicant['id']}"
                ):

                    r = update_application_status(
                        applicant["id"],
                        "Rejected",
                        token
                    )

                    if r.status_code == 200:

                        st.success(
                            "Candidate rejected!"
                        )

                        st.rerun()

                    else:

                        st.error(
                            "Failed to update status."
                        )

            st.divider()