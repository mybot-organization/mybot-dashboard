from __future__ import annotations

import httpx
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastui import AnyComponent, FastUI, components as c, prebuilt_html
from fastui.components.display import DisplayLookup
from fastui.events import GoToEvent
from pydantic import BaseModel, computed_field

app = FastAPI()


class Choice(BaseModel):
    id: int
    label: str
    count: int
    answers_preview: list[Answer]

    @computed_field
    def users_display(self) -> str | None:
        if not self.answers_preview:
            return None
        display = [answer.username_display for answer in self.answers_preview]
        if self.count > len(self.answers_preview):
            display.append(f"+{self.count - len(self.answers_preview)} more...")
        return ", ".join(display)


class Answer(BaseModel):
    username: str | None
    avatar: str | None
    anonymous: bool

    @computed_field
    @property
    def username_display(self) -> str:
        if self.anonymous:
            return "Anonymous"
        if not self.username:
            return "Unknown"
        return self.username


class UserInfo(BaseModel):
    username: str
    avatar: str


@app.get("/api/", response_model=FastUI, response_model_exclude_none=True)
def index() -> list[AnyComponent]:
    """ """
    return [
        c.Page(  # Page provides a basic container for components
            components=[
                c.Heading(text="Hello World", level=2),  # renders `<h2>Users</h2>`
            ]
        ),
    ]


@app.get("/api/poll/{poll_url}", response_model=FastUI, response_model_exclude_none=True)
def poll_overview(poll_url: str) -> list[AnyComponent]:
    response = httpx.get(f"http://mybot:8080/poll/{poll_url}/")
    raw = response.json()

    return [
        c.Page(
            components=[
                c.Heading(text=raw["title"], level=2),
                c.Table(
                    data=[Choice.model_validate(choice) for choice in raw["values"]],
                    columns=[
                        DisplayLookup(
                            field="label",
                            on_click=GoToEvent(url=f"/poll/{poll_url}/{{id}}"),
                        ),
                        DisplayLookup(
                            field="count",
                        ),
                        DisplayLookup(
                            field="users_display",
                        ),
                    ],
                ),
            ]
        ),
    ]


@app.get(
    "/api/poll/{poll_url}/{choice_id}",
    response_model=FastUI,
    response_model_exclude_none=True,
)
def poll_choice(poll_url: str, choice_id: int) -> list[AnyComponent]:
    response = httpx.get(f"http://mybot:8080/poll/{poll_url}/{choice_id}/")
    print(response.text)
    return [
        c.Table(
            data_model=Answer,
            data=[Answer.model_validate(answer) for answer in response.json()],
            columns=[
                DisplayLookup(
                    field="username_display",
                ),
            ],
        ),
    ]


@app.get("/{path:path}")
async def html_landing() -> HTMLResponse:
    """Simple HTML page which serves the React app, comes last as it matches all paths."""
    return HTMLResponse(prebuilt_html(title="FastUI Demo"))
