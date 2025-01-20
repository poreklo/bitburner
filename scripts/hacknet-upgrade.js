export async function main(ns) {
  const min_money = 0; // Skip upgrade if available money below min_money
  var hacknet = ns.hacknet;

  while (true) {
    if (ns.getServerMoneyAvailable("home") > min_money) {
      // Discover the details of the nodes configuration
      let aram = new Array();
      let acore = new Array();
      let alevel = new Array();
      for (let i = 0; i < hacknet.numNodes(); i++) {
        aram.push([i, hacknet.getRamUpgradeCost(i)]);
        acore.push([i, hacknet.getCoreUpgradeCost(i)]);
        alevel.push([i, hacknet.getLevelUpgradeCost(i)]);
      }

      let ram = aram.sort((a, b) => a[1] > b[1] ? 1 : -1).shift();
      let core = acore.sort((a, b) => a[1] > b[1] ? 1 : -1).shift();
      let level = alevel.sort((a, b) => a[1] > b[1] ? 1 : -1).shift();

      // Buy a new node if the current nodes are all in maximum configuration
      if (ram[1] == Infinity && core[1] == Infinity && level[1] == Infinity) {
        if (hacknet.getPurchaseNodeCost() < ns.getServerMoneyAvailable("home")) {
          ns.tprint("Purchase new hacknet node")
          hacknet.purchaseNode();
        }
        continue
      }

      // Upgrade configuration
      if (
        ns.getServerMoneyAvailable("home") > ram[1]
        &&
        ram[1] < core[1]
      ) {
        hacknet.upgradeRam(ram[0])
      } else if (
        ns.getServerMoneyAvailable("home") > core[1]
        &&
        core[1] < (level[1] * 10)
      ) {
        hacknet.upgradeCore(core[0])
      } else if (ns.getServerMoneyAvailable("home") > level[1]) {
        hacknet.upgradeLevel(level[0])
      }
    }
    await ns.asleep(300);
  }
}
