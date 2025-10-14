import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Test the database connection by trying to connect
    console.log('Attempting to connect to database...');
    await prisma.$connect();
    console.log('Database connection successful');
    
    // Try to get the count of products as a simple test
    const productCount = await prisma.product.count();
    console.log('Product count:', productCount);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connected successfully',
      productCount
    });
  } catch (error: any) {
    console.error('Database connection error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    return NextResponse.json(
      { 
        error: 'Database connection failed', 
        details: error.message || String(error),
        code: error.code
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}