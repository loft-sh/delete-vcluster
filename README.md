<p align="center">
  <a href="https://github.com/loft-sh/delete-vcluster/actions"><img alt="create-loft-space status" src="https://github.com/loft-sh/delete-vcluster/workflows/build-test/badge.svg"></a>
</p>

# delete-vcluster

This is a GitHub Action to delete a vcluster in Loft. It is intended to be used with the [setup-loft GitHub Action](https://github.com/loft-sh/setup-loft) to first install the Loft CLI.

## Usage

This action will delete a Loft VCluster.

### Example: Create and Delete a vcluster named `staging` on commits to `main`.
```yaml
name: Create Staging Cluster
on:
  push:
    branches:
      - 'main'
jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    steps:
      - name: Install Loft CLI
        uses: loft-sh/setup-loft@main
        with:
          url: ${{ secrets.LOFT_URL }}
          access-key: ${{ secrets.LOFT_ACCESS_KEY }}
      - name: Create staging VCluster
        uses: loft-sh/create-vcluster@main
        with:
          name: staging
      - name: Delete staging VCluster
        uses: loft-sh/delete-vcluster@main
        with:
          name: staging
```

## Customizing

### inputs

The following inputs can be used as `step.with` keys

| Name                | Type     | Description                        |
|---------------------|----------|------------------------------------|
| `name`              | String   | The name of the vcluster to delete
| `cluster`           | String   | The cluster on which to delete the vcluster (if there are multiple vclusters with the same name across multiple clusters)
| `project`           | String   | The project to use (requires Loft 3.0 and above)
| `space`             | String   | The space on which to delete the vcluster (if there are multiple vclusters with the same name across multiple spaces)
| `delete-space`      | String   | Should the corresponding space be deleted