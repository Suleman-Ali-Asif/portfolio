"use client";

import { motion } from "framer-motion";
import Image from "next/image";

function OneLiner() {
  return (
    <div className="bg-primary p-10 rounded-xl max-w-2xl relative overflow-hidden">
      {/* Rotating Flower Icon in the top-right */}
      <motion.div
        className="w-32 h-32 mb-6 ml-auto"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <Image
          src="/oneliner.svg"
          alt="Decorative Flower"
          width={128}
          height={128}
        />
      </motion.div>

      {/* Heading Text */}
      <h1>
        I’m a software engineer who loves turning ideas into fast, functional,
        and scalable web apps.
      </h1>
    </div>
  );
}

export default OneLiner;
