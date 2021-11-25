import React from 'react';

const CreatePost = () => {
  return (
    <div className='my-4'>
      <form>
        <div>
          <label className='block text-sm font-medium text-gray-600'>
            Title
          </label>
          <input
            className='border border-gray-300 outline-none focus:bg-gray-100 p-2 my-2 rounded'
            type='text'
          />
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
