function ImageUpload({ onChange }: { onChange: (image: string) => void }) {
  const toBase64 = (file: File): Promise<string | undefined> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let val = reader.result?.toString();

        return resolve(val?.split(",")[1]);
      };
      reader.onerror = reject;
    });

  return (
    <input
      hidden
      type="file"
      accept="image/*"
      onChange={async (e) => {
        let file = e.target.files?.item(0) ?? null;
        if (file) {
          let image = await toBase64(file);
          if (image) {
            onChange(image);
            e.target.files = null;
            e.target.value = null as any;
          }
        }
      }}
    />
  );
}

export default ImageUpload;
