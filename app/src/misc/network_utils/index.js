
import axios from 'axios'

const gitlabHeader = (oauth2) => {
    let headers = {
        Authorization: `Bearer ${oauth2}`
    }
    return headers;
}

export const gitlab_GetRepositoryList = (username, oauth2) => {
    let headers = gitlabHeader(oauth2);
    console.log(headers);
    return axios.get(`https://gitlab.com/api/v4/users/${username}/projects`, {
        headers
    });
}

export const gitlab_GetBranchList = (repoid, oauth2) => {
    let headers = gitlabHeader(oauth2);
    return axios.get(`https://gitlab.com/api/v4/projects/${repoid}/repository/branches`, {
        headers
    })
}

export const gitlab_addNewDeployKey = (selected, public_key, oauth2) => {
    let headers = gitlabHeader(oauth2)
    let data = new FormData()
    data.set('key', public_key)
    data.set('title', 'NetlifyClone')
    data.set('can_push', "false")
    return axios.post(`https://gitlab.com/api/v4/projects/${selected.repoid}/deploy_keys`, data, {
        headers
    });
}

export const gitlab_addGitHook = (repoid, oauth2) => {
    let headers = gitlabHeader(oauth2);
    let data = new FormData();
    let yourServer = ''
    data.set('id', repoid);
    data.set('url', `http://${yourServer}/app/hooks/gitlab`);
    data.set('push_events', "true");
    data.set('enable_ssl_verification', "false")
    return axios.post(`https://gitlab.com/api/v4/projects/${repoid}/hooks`, data, {
        headers
    });
}

export const netlifyClone_newDeployKey = () => {
    return axios.get(`/app/api/deploy_key`);
}

export const netlifyClone_deployKeySuccess = (siteid, provider, repoid, branch, repo_name, ssh_url_to_repo, build_command, work_dir) => {
    let data = new FormData();
    data.set('siteid', siteid)
    data.set('provider', provider)
    data.set('repoid', repoid)
    data.set('branch', branch)
    data.set('repo_name', repo_name)
    data.set('ssh_url_to_repo', ssh_url_to_repo)
    data.set('build_command', build_command)
    data.set('work_dir', work_dir)
    return axios.post(`/app/api/deploy_key`, data);
}

export const netlifyClone_allSitesList = () => {
    return axios.get(`/app/api/all_sites`);
}

export const netlifyClone_siteDetails = (id) => {
    return axios.get(`/app/api/site_info/${id}`);
}