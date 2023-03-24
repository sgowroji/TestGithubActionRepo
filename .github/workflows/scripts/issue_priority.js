/* 
When event occour, it will fetch all the open issues with label P0.
Check if label is more then 60 days old.
If yes, it will change the label to P1.
*/
module.exports = async ({ github, context }) => {
   
    //fetch all the open issues with label P0
    let issues = await github.rest.issues.listForRepo({
        owner: context.repo.owner,
        repo: context.repo.repo,
        state: "open",
        labels: "P0"
    });
    if (issues.status != 200)
        return
   let issueList = issues.data
    for (let i = 0; i < issueList.length; i++) {
        let number = issueList[i].number;
        // fetch label all the events inside issues 
        let resp = await github.rest.issues.listEventsForTimeline({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: number,
        });
        let events = resp.data;
        for (let i = 0; i < events.length; i++) {
            let event_details = events[i];
            console.log("event_details",event_details)
            if (event_details.event == 'labeled' && event_details.label && event_details.label.name == "P0") {
                let currentDate = new Date();
                let labeledDate = new Date(event_details.created_at)
                console.log("time diff",currentDate - labeledDate)
                if (currentDate - labeledDate > 2) {
                    //remove label P0 if more then 60 days old
                    await github.rest.issues.removeLabel({
                        issue_number: number,
                        owner: context.repo.owner,
                        repo: context.repo.repo,
                        name: "P0"

                    })
                    //add label P1
                    await github.rest.issues.addLabels({
                        issue_number: number,
                        owner: context.repo.owner,
                        repo: context.repo.repo,
                        labels:["P1"]

                    })
                }

            }
        }
    }
   
   
    //fetch all the open issues with label P1
    let p1issues = await github.rest.issues.listForRepo({
        owner: context.repo.owner,
        repo: context.repo.repo,
        state: "open",
        labels: "P1"
    });
    if (issues.status != 200)
        return
   let p1_issueList = p1issues.data
    for (let i = 0; i < p1_issueList.length; i++) {
        let number = p1_issueList[i].number;
        // fetch label all the events inside issues 
        let p1resp = await github.rest.issues.listEventsForTimeline({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: number,
        });
        let events = p1resp.data;
        for (let i = 0; i < events.length; i++) {
            let p1event_details = p1resp[i];
            console.log("event_details",p1event_details)
            if (p1event_details.event == 'labeled' && p1event_details.label && p1event_details.label.name == "P1") {
                let currentDate = new Date();
                let labeledDate = new Date(event_details.created_at)
                console.log("time diff",currentDate - labeledDate)
                if (currentDate - labeledDate > 2) {
                    //remove label P1 if more then 60 days old
                    await github.rest.issues.removeLabel({
                        issue_number: number,
                        owner: context.repo.owner,
                        repo: context.repo.repo,
                        name: "P1"

                    })
                    //add label P2
                    await github.rest.issues.addLabels({
                        issue_number: number,
                        owner: context.repo.owner,
                        repo: context.repo.repo,
                        labels:["P2"]

                    })
                }

            }
        }
    }
}
