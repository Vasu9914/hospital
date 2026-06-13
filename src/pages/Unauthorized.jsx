const Unauthorized = () => {
  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <h1 className='text-2xl font-bold mb-6 text-gray-800'>403 - Unauthorized</h1>
      <p className='text-gray-500'>You do not have permission to access this page.</p>
    </div>
  );
};

export default Unauthorized;