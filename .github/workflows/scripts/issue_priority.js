/* 
When event occour, it will fetch all the open issues with label p0.
Check if label is more then 60 days old.
If yes, it will change the label to p1.
*/
module.exports = async ({ github, context }) => {
   
    //fetch all the open issues with label p0
    let issues = await github.rest.issues.listForRepo({
        owner: context.repo.owner,
        repo: context.repo.repo,
        state: "open",
        labels: "p0"
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
            if (event_details.event == 'labeled' && event_details.label && event_details.label.name == "p0") {
                let currentDate = new Date();
                let labeledDate = new Date(event_details.created_at)
                console.log("time diff",currentDate - labeledDate)
                if (currentDate - labeledDate > 2) {
                    //remove label p0 if more then 60 days old
                    await github.rest.issues.removeLabel({
                        issue_number: number,
                        owner: context.repo.owner,
                        repo: context.repo.repo,
                        name: "p0"

                    })
                    //add label p1
                    await github.rest.issues.addLabels({
                        issue_number: number,
                        owner: context.repo.owner,
                        repo: context.repo.repo,
                        labels:["p1"]

                    })
                }

            }
        }
    }
}
