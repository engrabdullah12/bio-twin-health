import { useState } from "react";
import { motion } from "framer-motion";
import { Watch, Bluetooth, CheckCircle, Loader2, Smartphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const devices = [
  { name: "Apple Watch", icon: Watch, type: "apple_watch" },
  { name: "Fitbit", icon: Bluetooth, type: "fitbit" },
  { name: "Oura Ring", icon: Smartphone, type: "oura" },
];

export default function WearableSync() {
  const [syncing, setSyncing] = useState<string | null>(null);
  const [connected, setConnected] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const syncDevice = async (deviceType: string) => {
    if (!user) return;
    setSyncing(deviceType);

    // Simulate wearable sync
    setTimeout(async () => {
      const mockData = {
        user_id: user.id,
        device_type: deviceType,
        heart_rate: 68 + Math.floor(Math.random() * 12),
        glucose: 88 + Math.floor(Math.random() * 15),
        sleep_score: 75 + Math.floor(Math.random() * 20),
        cortisol: 12 + Math.random() * 6,
        steps: 4000 + Math.floor(Math.random() * 8000),
      };

      const { error } = await supabase.from("wearable_data").insert(mockData);

      if (error) {
        toast({ title: "Sync failed", description: error.message, variant: "destructive" });
      } else {
        setConnected(deviceType);
        toast({ title: "Device synced", description: `${deviceType.replace("_", " ")} data integrated into your Bio-Twin.` });
      }

      setSyncing(null);
    }, 2500);
  };

  if (!user) {
    return (
      <div className="glass rounded-lg p-6 text-center">
        <p className="text-sm text-muted-foreground font-body">Sign in to connect wearable devices</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-lg p-6 space-y-4"
    >
      <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
        <Watch className="w-5 h-5 text-primary" /> Wearable Devices
      </h3>
      <p className="text-xs text-muted-foreground font-body">
        Connect your wearable to feed real-time biometrics into your Bio-Twin.
      </p>

      <div className="space-y-3">
        {devices.map((device) => {
          const isConnected = connected === device.type;
          const isSyncing = syncing === device.type;

          return (
            <button
              key={device.type}
              onClick={() => !isConnected && syncDevice(device.type)}
              disabled={isSyncing}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                isConnected
                  ? "border-glow-accent/30 bg-glow-accent/5"
                  : "border-border bg-secondary/30 hover:border-primary/30"
              }`}
            >
              <device.icon className={`w-5 h-5 ${isConnected ? "text-glow-accent" : "text-muted-foreground"}`} />
              <span className="flex-1 text-left text-sm font-body text-foreground">{device.name}</span>
              {isSyncing ? (
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              ) : isConnected ? (
                <CheckCircle className="w-4 h-4 text-glow-accent" />
              ) : (
                <span className="text-xs text-muted-foreground">Connect</span>
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
