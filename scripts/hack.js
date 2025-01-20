export async function main(ns) {
    const args = ns.flags([['help', false]]);
    const hostname = args._[0];
    if (args.help || !hostname) {
      ns.tprint("This script will generate money by hacking a target server.");
      ns.tprint(`USAGE: run ${ns.getScriptName()} SERVER_NAME`);
      ns.tprint("Example:");
      ns.tprint(`> run ${ns.getScriptName()} n00dles`);
      return;
    }
    while (true) {
      var a = ns.getServerMoneyAvailable(hostname);
      var b = ns.getServerSecurityLevel(hostname);
      var prefix = `tim ${ns.getHostname()}[${ns.pid}] (${hostname}): `;

      ns.print(
        prefix,
        "Stat: ",
        ns.getServerSecurityLevel(hostname), "->",
        ns.getServerMinSecurityLevel(hostname), ", ",
        "$", Math.round(ns.getServerMoneyAvailable(hostname)), " / $", ns.getServerMaxMoney(hostname), ", ",
        ns.getHackingLevel()
      );
      if (ns.getServerSecurityLevel(hostname) > ns.getServerMinSecurityLevel(hostname)) {
        ns.print(prefix, "Weeaken ... ");
        await ns.weaken(hostname);
        ns.print(prefix, "The security level has been reduced by ", a - ns.getServerMinSecurityLevel(hostname));
      } else if (ns.getServerMoneyAvailable(hostname) < ns.getServerMaxMoney(hostname)) {
        // } else if (ns.getServerMoneyAvailable(hostname) < 100000) {
        ns.print(prefix, "Grow ... ");
        await ns.grow(hostname);
        ns.print(prefix, "Added $", Math.round(ns.getServerMoneyAvailable(hostname) - a));
      } else {
        ns.print(prefix, "Hack ...");
        await ns.hack(hostname);
        ns.print(prefix, "Earned $", Math.round(a - ns.getServerMoneyAvailable(hostname)));
      }
    }
  }
