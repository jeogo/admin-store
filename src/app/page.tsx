import Layout from "./components/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="container mx-auto mt-16 px-4">
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to the Admin Store
          </h1>
          <p className="text-lg text-gray-600">
            Manage users, products, and categories seamlessly.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <a
            href="/users"
            className="p-8 bg-blue-500 text-white rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 hover:bg-blue-600"
          >
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-4">Manage Users</h3>
              <p>View, edit, and delete users in your system.</p>
            </div>
          </a>

          <a
            href="/products"
            className="p-8 bg-green-500 text-white rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 hover:bg-green-600"
          >
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-4">Manage Products</h3>
              <p>Oversee the products available in your store.</p>
            </div>
          </a>

          <a
            href="/categories"
            className="p-8 bg-purple-500 text-white rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 hover:bg-purple-600"
          >
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-4">Manage Categories</h3>
              <p>Organize products into relevant categories.</p>
            </div>
          </a>
        </section>
      </div>
    </Layout>
  );
}
