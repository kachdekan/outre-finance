module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  /*
  await deploy('Loans', {
    from: deployer,
    log: true,
  })*/
  
  await deploy('LoanONRs', {
    from: deployer,
    log: true,
  })
  /*
  await deploy('Spaces', {
    from: deployer,
    log: true,
  })*/
}

module.exports.tags = ['Loans', 'LoanONRs']
