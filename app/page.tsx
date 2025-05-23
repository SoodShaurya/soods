import FluidCanvas from "../components/FluidCanvas";

export default function Home() {
  return (
    <>
      <FluidCanvas />
      {/* You can add other page content here if needed, 
          but it will likely be covered by the full-screen canvas 
          unless styled with a higher z-index or if the canvas is made non-full-screen */}
      {/* For example, content for the nav/footer is in layout.tsx */}
    </>
  );
} 