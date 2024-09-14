/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      screens:{
      xsm: '500px'
    }
  },
    container: {
      center: true,
    },
    
  },

  plugins: [require("flowbite/plugin")],
};
