import tempfile
import os
import streamlit as st

from api import analyze_resume


def show():

    st.title("📄 AI Resume Analyzer")

    st.write(
        """
Upload your resume and compare it against a job description.

The analyzer evaluates:

- ATS Score
- Skills Matching
- Education
- Experience
"""
    )

    uploaded_file = st.file_uploader(
        "Upload Resume",
        type=["pdf"]
    )

    job_description = st.text_area(
        "Paste Job Description",
        height=250
    )

    if st.button("Analyze Resume"):

        if uploaded_file is None:
            st.warning("Please upload a resume.")
            return

        if job_description.strip() == "":
            st.warning("Please paste a job description.")
            return

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf"
        ) as tmp:

            tmp.write(uploaded_file.getvalue())
            pdf_path = tmp.name

        with st.spinner("Analyzing your resume against the job description..."):

            try:
                response = analyze_resume(
                    pdf_path,
                    job_description,
                    st.session_state.token
                )

            finally:
                os.remove(pdf_path)

        if response.status_code != 200:

            st.error(f"Status Code: {response.status_code}")

            try:
                st.json(response.json())
            except:
                st.code(response.text)

            return

        result = response.json()

        st.success("Analysis Complete!")

        st.divider()

        # =====================================================
        # ATS SCORE
        # =====================================================

        st.metric(
            "ATS Score",
            f"{result['ats_score']}%"
        )

        st.progress(result["ats_score"] / 100)

        st.divider()

        # =====================================================
        # SECTION SCORES
        # =====================================================

        st.subheader("📊 Section Scores")

        scores = result["section_scores"]

        c1, c2, c3 = st.columns(3)

        with c1:
            st.metric(
                "Skills",
                f"{scores['skills']}%"
            )

        with c2:
            st.metric(
                "Education",
                f"{scores['education']}%"
            )

        with c3:
            st.metric(
                "Experience",
                f"{scores['experience']}%"
            )

        st.divider()

        # =====================================================
        # MATCHED SKILLS
        # =====================================================

        left, right = st.columns(2)

        with left:

            st.subheader("✅ Matching Skills")

            if result["matched_skills"]:

                for skill in result["matched_skills"]:
                    st.success(skill)

            else:
                st.info("No matching skills.")

        with right:

            st.subheader("❌ Missing Skills")

            if result["missing_skills"]:

                for skill in result["missing_skills"]:
                    st.error(skill)

            else:
                st.success("No missing skills.")

        st.divider()

        # =====================================================
        # EDUCATION
        # =====================================================

        left, right = st.columns(2)

        with left:

            st.subheader("✅ Matching Education")

            if result["matched_education"]:

                for edu in result["matched_education"]:
                    st.success(edu)

            else:
                st.info("No matching education.")

        with right:

            st.subheader("❌ Missing Education")

            if result["missing_education"]:

                for edu in result["missing_education"]:
                    st.error(edu)

            else:
                st.success("No missing education.")

        st.divider()

        # =====================================================
        # EXPERIENCE
        # =====================================================

        st.subheader("💼 Experience")

        required_exp = result["job_information"]["experience_years"]
        candidate_exp = result["resume_information"]["experience_years"]

        c1, c2 = st.columns(2)

        with c1:
            st.metric(
                "Candidate Experience",
                f"{candidate_exp} years"
            )

        with c2:
            st.metric(
                "Required Experience",
                f"{required_exp} years"
            )

        st.divider()

        # =====================================================
        # RESUME INFORMATION
        # =====================================================

        st.subheader("📄 Resume Information")

        resume = result["resume_information"]

        c1, c2 = st.columns(2)

        with c1:

            st.write("### Education")

            if resume["education"]:

                for item in resume["education"]:
                    st.write("•", item)

            else:
                st.write("No education extracted.")

            st.write("### Experience")

            st.write(
                f"{resume['experience_years']} years"
            )

        with c2:

            st.write("### Skills")

            if resume["skills"]:
                st.write(", ".join(resume["skills"]))
            else:
                st.write("No skills extracted.")

        st.divider()

        # =====================================================
        # JOB INFORMATION
        # =====================================================

        st.subheader("📋 Job Information")

        job = result["job_information"]

        c1, c2 = st.columns(2)

        with c1:

            st.write("### Required Education")

            if job["education"]:

                for item in job["education"]:
                    st.write("•", item)

            else:
                st.write("Not specified.")

            st.write("### Required Experience")

            st.write(
                f"{job['experience_years']} years"
            )

        with c2:

            st.write("### Required Skills")

            if job["skills"]:
                st.write(", ".join(job["skills"]))
            else:
                st.write("Not specified.")

        st.divider()

        # =====================================================
        # SUGGESTIONS
        # =====================================================

        st.subheader("💡 Suggestions")

        for suggestion in result["suggestions"]:
            st.info(suggestion)

        st.divider()

        # =====================================================
        # FINAL VERDICT
        # =====================================================

        ats = result["ats_score"]

        if ats >= 85:

            st.success("🟢 Excellent Match!")

        elif ats >= 70:

            st.info("🟡 Good Match!")

        elif ats >= 50:

            st.warning("🟠 Average Match")

        else:

            st.error("🔴 Resume needs improvement before applying.")