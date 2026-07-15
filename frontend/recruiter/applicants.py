import base64
import streamlit as st

from api import (
    get_applicants,
    update_application_status,
    get_resume_bytes,
    get_applicant_analysis
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

    # --------------------------------------
    # Rank applicants by AI Match Score
    # --------------------------------------

    applicants = sorted(
        applicants,
        key=lambda a: a["match_score"],
        reverse=True
    )

    for rank, applicant in enumerate(applicants, start=1):

        with st.container(border=True):

            # --------------------------
            # Candidate Info
            # --------------------------

            st.subheader(
                f"{rank})  {applicant['candidate']['name']}"
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
            # Detailed AI Analysis
            # --------------------------

            analysis_key = f"analysis_{applicant['id']}"

            with st.expander("View Detailed Analysis"):

                if not applicant["resume_path"]:

                    st.info(
                        "Candidate has not uploaded a resume yet, "
                        "so a detailed analysis isn't available."
                    )

                else:

                    if analysis_key not in st.session_state:

                        if st.button(
                            "Analyze Resume",
                            key=f"analyze_btn_{applicant['id']}"
                        ):

                            with st.spinner("Analyzing resume against job requirements..."):

                                analysis_response = get_applicant_analysis(
                                    applicant["id"],
                                    token
                                )

                            if analysis_response.status_code == 200:

                                st.session_state[analysis_key] = analysis_response.json()

                                st.rerun()

                            else:

                                try:
                                    st.error(
                                        analysis_response.json()["detail"]
                                    )
                                except:
                                    st.error(
                                        "Unable to analyze this resume."
                                    )

                    else:

                        analysis = st.session_state[analysis_key]

                        sections = analysis["section_scores"]

                        st.write("#### Section Scores")

                        sc1, sc2, sc3 = st.columns(3)

                        sc1.metric("Skills", f"{sections['skills']}%")
                        sc2.metric("Education", f"{sections['education']}%")
                        sc3.metric("Experience", f"{sections['experience']}%")

                        st.divider()

                        col1, col2 = st.columns(2)

                        with col1:

                            st.write("#### Matched Skills")

                            if analysis["matched_skills"]:
                                for skill in analysis["matched_skills"]:
                                    st.success(skill)
                            else:
                                st.caption("None matched.")

                            st.write("#### Matched Education")

                            if analysis["matched_education"]:
                                for item in analysis["matched_education"]:
                                    st.success(item)
                            else:
                                st.caption("None matched.")

                        with col2:

                            st.write("#### Missing Skills")

                            if analysis["missing_skills"]:
                                for skill in analysis["missing_skills"]:
                                    st.error(skill)
                            else:
                                st.caption("None missing.")

                            st.write("#### Missing Education")

                            if analysis["missing_education"]:
                                for item in analysis["missing_education"]:
                                    st.error(item)
                            else:
                                st.caption("None missing.")

                        st.divider()

                        candidate_exp = analysis["resume_information"]["experience_years"]
                        required_exp = analysis["job_information"]["experience_years"]

                        st.write("#### Experience")

                        st.write(
                            f"Candidate has **{candidate_exp} year(s)** of experience "
                            f", job requires **{required_exp} year(s)**."
                        )

                        st.divider()

                        if st.button(
                            "Re-analyze",
                            key=f"reanalyze_btn_{applicant['id']}"
                        ):

                            del st.session_state[analysis_key]

                            st.rerun()

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