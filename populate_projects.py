import os
import pandas as pd
from string import Template

csv_file_path = "https://docs.google.com/spreadsheets/d/1CTYnf0aFwSdK2Ph2x-S9tITyOr3BeG9k5QtbMG91NXQ/export?format=csv"
project_card_path = "assets/templates/project_card.html"
projects_page_path = "assets/templates/template_projects.md"

def populate_project_card(title, description, leader):
    with open(str(project_card_path), 'r') as card:
        card_tpl = Template(card.read())
        card_html = card_tpl.substitute(projectTitle=title,
                                        projectDescription=description,
                                        projectLeader=leader)
    card.close()
    return card_html


def populate_projects_page(html):
    with open(str(projects_page_path), 'r') as prj:
        prj_tpl = Template(prj.read())
        prj_html = prj_tpl.substitute(projectCards=html,
                                      link="/projects/")
    prj.close()
    return prj_html


def main():
    # Read CSV file
    df = pd.read_csv(csv_file_path)
    df = df[df["Project leader:"].notna()]

    prj_card = ""

    for pj_index, prj_row in df.iterrows():
        prj_title = prj_row["Project title:"]
        prj_descr = prj_row["What is the purpose of the project?"]
        prj_leader = prj_row["Project leader:"]

        prj_card += populate_project_card(prj_title, prj_descr, prj_leader)

    prj_page = populate_projects_page(prj_card)

    with open("projects.md", "wb") as f:
        f.write(prj_page.encode("utf-8"))
    f.close()

if __name__ == "__main__":
    main()