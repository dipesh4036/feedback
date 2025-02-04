import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import bcrypt from "bcrypt";
import {sendVerificationEmail} from "@/helpers/sendVerificationEmail"
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect(); // Connect to the database

  try {
    // Extract data from request body
    const { username, email, password } = await request.json();

    // Check if the email is already registered
    const userCheckByEmail = await User.findOne({ email });
    if (userCheckByEmail) {
      return NextResponse.json({
        message: "User already registered with this email.",
      }, { status: 400 });
    }

    // Check if the username is already taken
    const userCheckByUsername = await User.findOne({ username });
    if (userCheckByUsername) {
      return NextResponse.json({
        message: "Username is already taken. Please choose another.",
      }, { status: 400 });
    }

    // Generate OTP for email verification
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Set OTP expiration time (1 hour from now)
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      verifyCode: code,
      verifyCodeExpiry: expiryDate,
      messages: [],
    });

    // Save new user to the database
    await newUser.save();

    // Send verification email
    await sendVerificationEmail(username,code,email)

    // Return success response
    return NextResponse.json({
      message: "User registered successfully. Please check your email for verification.",
      user: newUser,
    });

  } catch (error: any) {
    console.error("Error during registration:", error);
    return NextResponse.json({
      message: error.message || 'Internal Server Error',
    }, { status: 500 });
  }
  
}
