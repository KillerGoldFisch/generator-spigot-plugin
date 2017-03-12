package <% if (props.namespace) { %><%= props.namespace %><% } %>;

import org.bukkit.ChatColor;
import org.bukkit.OfflinePlayer;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.plugin.RegisteredServiceProvider;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.scheduler.BukkitRunnable;

public class Main extends JavaPlugin implements CommandExecutor {

    private static Main instance;
    public static Main getI() { return instance; }

    @Override
    public void onEnable() {
        this.saveDefaultConfig();

        instance = this;

        for(String line : BuildInfo.getInfoText().split("\n")) {
            System.out.println(line);
        }

<% if (props.title) { %>
        getCommand("<%= props.title %>").setExecutor(this);
<% } %>
    }

    @Override
    public void onDisable() {
        //
    }

    @Override
    public boolean onCommand(CommandSender sender, Command cmd, String label, String[] args) {

        /* TEST for PLAYER */
        boolean isPlayer = sender instanceof Player;
        if(!isPlayer) {
            sender.sendMessage(ChatColor.RED + "This Command must executed by a Player!");
            return true;
        }

        Player player = (Player)sender;

        sender.sendMessage(ChatColor.BLUE + "Hello World");


        return false;
    }
}