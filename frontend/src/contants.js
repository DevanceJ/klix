const BOILERPLATE = {
  javascript: `// JavaScript Boilerplate
  
  function main() {
    console.log('Hello, World!');
  }
  
  main();
  `,

  python: `# Python Boilerplate
  
  def main():
      print('Hello, World!')
  
  main()
  `,

  java: `// Java Boilerplate
  
  public class Main {
      public static void main(String[] args) {
          System.out.println("Hello, World!");
      }
  }
  `,

  cpp: `// C++ Boilerplate
  
  #include <iostream>
  using namespace std;

  int main() {
      cout << "Hello, World!" << endl;
      return 0;
  }
  `
};

export default BOILERPLATE;
