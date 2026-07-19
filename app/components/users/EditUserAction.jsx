import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ImageCropper from "@/components/ImageCropper";
import { toast } from "react-hot-toast"; // Assuming react-hot-toast, adjust if sonner is used.
import { toast as sonnerToast } from "sonner"; 

export function EditUserAction({ user }) {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState(user.email || "");
    const [role, setRole] = useState(user.role || "");
    const [imageSrc, setImageSrc] = useState(null);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            let imageDataUrl = await readFile(file);
            setImageSrc(imageDataUrl);
        }
    };

    const readFile = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => resolve(reader.result), false);
            reader.readAsDataURL(file);
        });
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Disini tambahkan logika submit ke API.
        console.log("Submitting:", { email, role, croppedAreaPixels });
        
        sonnerToast("User updated successfully");
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">Edit</Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Role</label>
                        <Input 
                            type="text" 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)} 
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Foto</label>
                        <Input type="file" accept="image/*" onChange={onFileChange} />
                    </div>
                    {imageSrc && (
                        <div className="mt-4">
                            <ImageCropper 
                                imageSrc={imageSrc} 
                                onCropComplete={onCropComplete} 
                            />
                        </div>
                    )}
                    <Button type="submit">Save Changes</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
