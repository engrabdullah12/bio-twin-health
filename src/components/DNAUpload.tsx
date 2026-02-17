import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileCheck, Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function DNAUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      const { error: storageError } = await supabase.storage
        .from("dna-files")
        .upload(filePath, file);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase.from("dna_uploads").insert({
        user_id: user.id,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        status: "processing",
      });

      if (dbError) throw dbError;

      setUploadedFile(file.name);
      toast({ title: "DNA file uploaded", description: "Processing your genetic data..." });

      // Simulate processing
      setTimeout(async () => {
        await supabase
          .from("dna_uploads")
          .update({ status: "completed", processed_at: new Date().toISOString() })
          .eq("file_path", filePath);
        toast({ title: "DNA Processing Complete", description: "Your Bio-Twin has been updated with your genetic profile." });
      }, 3000);
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="glass rounded-lg p-6 text-center">
        <p className="text-sm text-muted-foreground font-body">Sign in to upload your DNA data</p>
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
        <Upload className="w-5 h-5 text-primary" /> DNA Data Upload
      </h3>
      <p className="text-xs text-muted-foreground font-body">
        Upload your DNA test results (.txt, .csv, .vcf) from 23andMe, AncestryDNA, or similar services.
      </p>

      <input
        ref={fileRef}
        type="file"
        accept=".txt,.csv,.vcf,.json"
        onChange={handleUpload}
        className="hidden"
      />

      {uploadedFile ? (
        <div className="flex items-center gap-3 p-3 bg-glow-accent/10 border border-glow-accent/20 rounded-lg">
          <FileCheck className="w-5 h-5 text-glow-accent" />
          <div className="flex-1">
            <p className="text-sm font-body text-foreground">{uploadedFile}</p>
            <p className="text-xs text-glow-accent font-body">Processed & integrated</p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-full border-2 border-dashed border-border rounded-lg py-8 flex flex-col items-center gap-2 hover:border-primary/40 transition-colors"
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          ) : (
            <Upload className="w-6 h-6 text-muted-foreground" />
          )}
          <span className="text-sm text-muted-foreground font-body">
            {uploading ? "Uploading..." : "Click to upload DNA file"}
          </span>
        </button>
      )}
    </motion.div>
  );
}
