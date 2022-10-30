export class GitHubUsers {
    static search(username) {
      const local = `https://api.github.com/users/${username}`
      return fetch(local)
      .then(data => data.json())
      .then(({login, name, public_repos, followers}) => ({
        login,
        name,
        public_repos,
        followers,
      }))
    }
  }