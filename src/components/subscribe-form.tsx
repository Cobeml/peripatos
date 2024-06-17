import React from 'react';

export const SubscribeForm = () => {
  return (
    <form method="post" action="https://peripatos-listmonk.up.railway.app/subscription/form" className="listmonk-form justify-center items-center z-40">
      <div>
        <h1 className="relative text-4xl sm:text-6xl lg:text-9xl font-bold text-center">
          Join the waitlist
        </h1>
        <p className="text-neutral-400 max-w-lg mx-auto my-2 text-sm text-center relative">
          Joining will grant you early access to upcoming releases as well as keep you updated on Peripatos.
        </p>
        <input type="hidden" name="nonce" />
        <p>
          <input 
            type="email" 
            name="email" 
            required placeholder="Email" 
            className="rounded-lg border border-neutral-300 focus:ring-2 focus:ring-teal-500 w-full relative mt-3 bg-neutral-950 placeholder:text-neutral-400"
          />
        </p>
        <p>
          <input
            type="text"
            name="name"
            placeholder="Name (optional)"
            className="rounded-lg border border-neutral-300 focus:ring-2 focus:ring-teal-500 w-full relative mt-3 bg-neutral-950 placeholder:text-neutral-400"
          />
        </p>
        <p className="flex items-center space-x-2 justify-center mt-3">
          <input
            id="e7d10"
            type="checkbox"
            name="l"
            defaultChecked value="e7d10ec7-c55e-4599-8054-b704a81f4a18"
          />
          <label htmlFor="e7d10" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            I want to receive updates on Peripatos
          </label>
        </p>
        <div className="flex justify-center items-center mt-3 w-full">
          <input
            type="submit"
            value="Subscribe"
            className="bg-pink-800 rounded-lg px-4 py-2 hover:bg-pink-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
          />
        </div>
      </div>
    </form>
  );
};
