from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas

router = APIRouter(
    prefix="/contact",
    tags=["Contact"]
)


@router.post(
    "/",
    response_model=schemas.ContactMessageResponse
)
def submit_contact_message(
    contact_message: schemas.ContactMessageCreate,
    db: Session = Depends(get_db)
):
    new_message = models.ContactMessage(
        name=contact_message.name,
        email=contact_message.email,
        message=contact_message.message
    )

    db.add(new_message)
    db.commit()
    db.refresh(new_message)

    return new_message
