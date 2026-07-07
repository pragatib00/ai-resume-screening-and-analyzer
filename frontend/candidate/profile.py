import streamlit as st

def show():

    user = st.session_state.user

    st.title(" My Profile")

    st.write(f"### {user['name']}")

    st.write(f"Email : {user['email']}")

    st.write(f"Role : {user['role']}")