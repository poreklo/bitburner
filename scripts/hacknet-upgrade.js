/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("ALL");
  const min_money = 0; // Skip upgrade if available money below min_money
  const maxPurchaseSum = 1e9; // Max purchase sum
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

      if (ram[1] == Infinity && core[1] == Infinity && level[1] == Infinity) {
        if (hacknet.getPurchaseNodeCost() > maxPurchaseSum) {
          ns.print("INFO: The maximum purchase amount has been reached.");
          ns.print("INFO: Exit.");
          ns.exit();
        }
        // Buy a new node if the current nodes are all in maximum configuration
        if (hacknet.getPurchaseNodeCost() < ns.getServerMoneyAvailable("home")) {
          ns.tprint("Purchase new hacknet node")
          if (hacknet.purchaseNode() == -1) {
            ns.print("ERR: Can not purchase new hackent node.");
            ns.print("INFO: Exit.")
            ns.exit();
          };
        }
      } else {
        // Upgrade configuration
        if (
          ns.getServerMoneyAvailable("home") > ram[1]
          &&
          ram[1] < core[1]
        ) {
          ns.print(`INFO: Upgrade RAM for node ${ram[0]}`)
          hacknet.upgradeRam(ram[0])
        } else if (
          ns.getServerMoneyAvailable("home") > core[1]
          &&
          core[1] < (level[1] * 10)
        ) {
          ns.print(`INFO: Upgrade CORE for node ${core[0]}`)
          hacknet.upgradeCore(core[0])
        } else if (ns.getServerMoneyAvailable("home") > level[1]) {
          ns.print(`INFO: Upgrade Level for node ${level[0]}`)
          hacknet.upgradeLevel(level[0])
        }
      }
    }
    await ns.sleep(300);
  }
}
