import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import ImageCropper from "@/components/ImageCropper";
import { toast as sonnerToast } from "sonner";
import { fetcher } from "@/lib/fetcher";
import { useForm } from "@/hooks/use-form";

const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.src = url;
    });

async function getCroppedImg(imageSrc, pixelCrop) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve) => {
        canvas.toBlob((file) => {
            resolve(file);
        }, "image/jpeg");
    });
}

export function EditUserAction({ user }) {
    const [open, setOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const { data, setData, processing, setProcessing, setErrors } = useForm({
        email: user.email || "",
        id_role: user.role || "",
    });

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
        setProcessing(true);

        try {
            const FData = new FormData();
            FData.append("email", data.email);
            FData.append("id_role", data.id_role);

            if (imageSrc && croppedAreaPixels) {
                const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
                FData.append("avatar", croppedImageBlob, "avatar.jpg");
            }

            const response = await fetcher(`/user/${user.username}`, {
                method: "PUT",
                payload: FData,
            });

            const result = await response.json();
            sonnerToast.success(result.message);
        } catch (error) {
            console.error(error);
            sonnerToast.error(error.message);
            setErrors({ general: error.message });
        } finally {
            setProcessing(false);
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">Edit</Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Role</label>
                        <Select
                            value={data.id_role}
                            onValueChange={(value) => setData("id_role", value)}
                        >
                            <SelectTrigger className="w-full max-w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Role</SelectLabel>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
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
                    <Button type="submit" disabled={processing}>
                        {processing ? "Menyimpan..." : "Save Changes"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
