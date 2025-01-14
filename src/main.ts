import * as core from "@actions/core";
import * as github from "@actions/github";

async function run() {
  try {
    const token = core.getInput("github-token", { required: true });
    const shouldMerge = core.getInput("merge");

    const { pull_request: pr } = github.context.payload;
    if (!pr) {
      throw new Error("Event payload missing `pull_request`");
    }

    const client = new github.GitHub(token);
    core.debug(`Creating approving review for pull request #${pr.number}`);

    const params = {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: pr.number
    };

    await client.pulls.createReview({ ...params, event: "APPROVE" });
    if (shouldMerge) await client.pulls.merge(params);

    core.debug(`Approved pull request #${pr.number}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
