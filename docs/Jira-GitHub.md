# Integration Jira + GitHub
In this project, we integrated Jira with GitHub. On our Jira-site, we have prefix PLANT, so every epic/task/subtask has its own PLANT-<num>. In order to integrate it to GitHub, there are some rules:
## Branches
To correctly name branch, use this template:
```
feature/PLANT-<num>-<name>-<of>-<the>-<feature>
```
## Commits
If you have subtask on some tasks in Jira, you can set their status this way:
### Task PLANT-23 "Config System"
#### Subtask PLANT-24 "Configure necessary modules."
In this case, to renew status of PLANT-24, we can use this type of commit:
```
git commit -m "PLANT-24 : <text>"
```
## Smart Commits (Status control)
To change status of the task in Jira directly from Git:
- `git commit -m "PLANT-24 #done implement basic express routes"` — will close the task.
- `git commit -m "PLANT-24 #comment Still working on middleware"` — adds a comment to Jira.