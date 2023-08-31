module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  await deploy('Spaces', {
    from: deployer,
    log: true,
  })
  await deploy('P2PLoans', {
    from: deployer,
    log: true,
  })
  await deploy('Personal', {
    from: deployer,
    log: true,
  })
}

module.exports.tags = ['Spaces', 'Rosca', 'Personal', 'utils', 'P2PLoans']
