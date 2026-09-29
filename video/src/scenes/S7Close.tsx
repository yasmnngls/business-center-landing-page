import React from "react";
import { Wordmark } from "../components/Wordmark";

// Same treatment as the turn. Everything settles by frame ~54; the last two seconds are still.
export const S7Close: React.FC = () => <Wordmark sub="Request access." markAt={6} subAt={30} />;
