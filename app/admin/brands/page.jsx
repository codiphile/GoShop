import Form from "./components/form";
import ListView from "./components/ListView";

export default function Page() {
  return (
    <main className="p-5 flex flex-col md:flex-row gap-5">
      <Form />
      <ListView />
    </main>
  );
}
