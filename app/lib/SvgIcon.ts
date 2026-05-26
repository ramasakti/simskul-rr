export default function SvgIcon({ svg, className }: { svg: string; className?: string }) {
    // Inject className ke dalam SVG string agar ukuran bisa dikontrol
    const withClass = svg.replace(
        /<svg /,
        `<svg class="${className ?? "h-4 w-4"}" `
    );
    return <span dangerouslySetInnerHTML={{ __html: withClass }} />;
}