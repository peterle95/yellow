import Aurora from '../../components/Aurora';

export default function AuroraTestPage() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <Aurora
        colorStops={["#7cff67", "#B497CF", "#5227FF"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="text-6xl font-bold text-white drop-shadow-lg">Aurora Effect</h1>
      </div>
    </div>
  );
}
