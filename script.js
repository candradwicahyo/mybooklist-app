window.addEventListener('DOMContentLoaded', () => {
  
  // array kosong
  let books = [];
  
  // tempat menampilkan element yang sudah dirender
  const content = document.querySelector('.content');
  
  // input
  const inputTitle = document.querySelector('.input-title');
  const inputAuthor = document.querySelector('.input-author');
  const inputIsbn = document.querySelector('.input-isbn');
  
  // tombol submit
  const btnSubmit = document.querySelector('.btn-submit');
  btnSubmit.addEventListener('click', function(event) {
    // berfungsi untuk mencegah perilaku bawaan element HTML seperti form 
    event.preventDefault();
    // teks dari tombol submit
    const value = this.textContent.toLowerCase();
    
    // jika teks tombol submit ada kata "add"
    if (value.includes('add')) {
      
      // value input
      const data = getInputValues();
      
      // lakukan validasi terlebih dahulu
      if (validate(data)) {
        
        // cek apakah buku sudah ada di dalam daftar
        if (isBookExist(data)) return alerts('danger', 'Error', 'Book is already in the list!');
        // jika buku belum ada di dalam daftar
        // masukkan isi variabel "data" kedalam array dari variabel "books"
        books.unshift(data);
        // simpan perubahann data kedalam localstorage
        saveToLocalstorage();
        // berikan pesan bahwa "buku berhasil ditambahkan"
        alerts('success', 'Success', 'Book has been added!');
        // muat data yang ada di dalam localstorage
        loadBook();
        // bersihkan value pada form
        clear();
        
      }
      
    }
    
  });
  
  function getInputValues() {
    return {
      title: inputTitle.value.trim(),
      author: inputAuthor.value.trim(),
      isbn: inputIsbn.value.trim()
    };
  }
  
  function validate({ title, author, isbn }) {
    // jika semua input kosong
    if (!title && !author && !isbn) return alerts('danger', 'Error', 'all input is empty!');
    // jika masih ada input yang kosong
    if (!title || !author || !isbn) return alerts('danger', 'Error', 'input is empty!');
    // jika field author berisikan angka
    if (author.match(/[0-9]/gi)) return alerts('danger', 'Error', 'Please enter the author\'s name using letters only.');
    // jika panjang karakter di field isbn kurang dari 10 digit
    if (isbn.length < 10) return alerts('danger', 'Error', 'The ISBN field must be at least 10 characters long!');
    // jika panjang karakter di field isbn lebih dari 13 digit
    if (isbn.length > 13) return alerts('danger', 'Error', 'The ISBN field must be no more than 13 characters long!');
    // kembalikan nilai boolean true jika berhasil melewati semua validasi
    return true;
  }
  
  function alerts(type, title, text) {
    const container = document.querySelector('.error-container');
    container.innerHTML = elementAlerts(type, title, text);
    setTimeout(() => {
      container.innerHTML = '';
    }, 3000);
  }
  
  function elementAlerts(type, title, text) {
    return `
    <div class="alert alert-${type} rounded-1">
      <h3 class="fw-semibold mb-1">${title}</h3>
      <span class="d-block fw-light my-auto">${text}</span>
    </div>
    `;
  }
  
  function isBookExist({ title, author, isbn }) {
    // nilai default berupa boolean false jika buku tersebut belum pernah dibuat
    let exist = false;
    // looping variabel "books"
    books.forEach(book => {
      /*
        jika objek dari variabel "book" dengan properti "title" sama dengan isi parameter "title" dan
        jika objek dari variabel "book" dengan properti "author" sama dengan isi parameter "author" dan
        jika objek dari variabel "book" dengan properti "isbn" sama dengan isi parameter "isbn" maka
        kembalikan nilai boolean true
      */
      if (book.title == title && book.author == author && book.isbn == isbn) exist = true;
    });
    /*
      jika mengembalikan nilai boolean false, maka buku tersebut belum pernah dibuat
      jika mengembalikan nilai boolean true, maka buku tersebut sudah pernah dibuat sebelumnya
    */
    return exist;
  }
  
  function saveToLocalstorage() {
    /*
      masukkan isi variabel books kedalam localstorage dan konversikan isi variabel books
      menjadi sebuah string JSON.
    */
    localStorage.setItem('mybook-list', JSON.stringify(books));
  }
  
  function showUI(data, index) {
    // render data menjadi sebuah element html
    const result = elementUI(data, index);
    // tampilkan element tersebut ke halaman
    content.insertAdjacentHTML('beforeend', result);
  }
  
  function elementUI({ title, author, isbn }, index) {
    return `
    <tr>
      <td class="p-3 fw-light">${title}</td>
      <td class="p-3 fw-light">${author}</td>
      <td class="p-3 fw-light">${isbn}</td>
      <td class="p-3 fw-light">
        <button 
          class="btn btn-success btn-sm rounded-0 btn-edit m-1"
          data-index="${index}">
          edit
        </button>
        <button 
          class="btn btn-danger btn-sm rounded-0 btn-delete m-1"
          data-index="${index}">
          delete 
        </button>
      </td>
    </tr>
    `;
  }
  
  function loadBook() {
    // bersihkan element content
    content.innerHTML = '';
    // ambil data yang ada di localstorage
    const data = localStorage.getItem('mybook-list');
    /*
      jika variabel data menghasilkan boolean true, maka bisa dipastikan ada data di dalam localstorage.
      dan jika ada data di dalam localstorage, maka ubah isi variavel books dengan data dari localstorage yang sudah di parsing
      menjadi sebuah JSON. taoi jika tidak ada data di dalam localstorage, maka ubah isi variabel books dengan array kosong
    */
    books = (data) ? JSON.parse(data) : [];
    // looping variabel books dan jalankan fungsi showUI()
    books.forEach((book, index) => showUI(book, index));
  }
  
  loadBook();
  
  function clear() {
    // element form 
    const forms = document.querySelectorAll('.form');
    forms.forEach(form => form.reset());
  }
  
  // hapus data
  window.addEventListener('click', event => {
    // mencegah default behavior dari element html seperti form dsn lain sebagainya
    event.preventDefault();
    // jika element yang ditekan memiliki class "btn-delete"
    if (event.target.classList.contains('btn-delete')) {
      // ambil isi atribut "data-index" dari element yang ditekan
      const index = event.target.dataset.index;
      // jalankan fungsi deleteIndex()
      deleteBook(index);
    }
  });
  
  function deleteBook(index) {
    // plugin dari sweetalert2
    swal.fire ({
      icon: 'info',
      title: 'Are you sure?',
      text: 'do you want to delete this data?',
      showCancelButton: true
    })
    .then(response => {
      // jika tombol yang dhtekan bertuliskan "ok" atau "yes"
      if (response.isConfirmed) {
        /*
          hapus array dari variabel "books" dengan index yang sesuai dengan isi parameter "index"
          lalu hapus array tersebut
        */
        books.splice(index, 1);
        // simpan perubahan data kedalam localstorage
        saveToLocalstorage();
        // beri pesan bahwa "buku berhasil dihapus"
        alerts('success', 'Success', 'Book has been deleted!');
        // load data yang ada di localstorage
        loadBook();
      }
    });
  }
  
  // edit atau ubah data buku
  window.addEventListener('click', event => {
    // mencegah default behavior dari element html seperti form dsn lain sebagainya
    event.preventDefault();
    // jika element yang ditekan memiliki class "btn-edit"
    if (event.target.classList.contains('btn-edit')) {
      // ambil isi atribut "data-index" dari element yang ditekan
      const index = event.target.dataset.index;
      /*
        isi setiap input dengan data yang ada di variabel "books" dengan 
        index dari isi variabel "index"
      */
      setValueInput(index);
      // ubah teks tombol submit
      btnSubmit.textContent = 'edit book';
      // jalankan fungsi editBook()
      editBook(index);
    }
  });
  
  function setValueInput(index) {
    // set value input
    inputTitle.value = books[index].title;
    inputAuthor.value = books[index].author;
    inputIsbn.value = books[index].isbn;
  }
  
  function editBook(index) {
    // ketika tombol submit ditekan
    btnSubmit.addEventListener('click', function() {
      // teks tombol submit
      const value = this.textContent.toLowerCase();
      // jika teks tombol submit bertuliskan kata "edit"
      if (value.includes('edit')) {
        
        // value input
        const data = getInputValues();
        
        // validasi terlebih dahulu
        if (validate(data)) {
          
          // cek, apakah buku sudah pernah dibuat sebelumnya atau belum
          if (isBookExist(data)) return alerts('danger', 'Error', 'book is already in the list!');
          // jika buku tersebut belum pernah dibuat sebelumnya
          books[index] = data;
          // simpan perubahan data kedalam localstorage
          saveToLocalstorage();
          // berikan pesan bahwa "buku berhasil diubah"
          alerts('success', 'Success', 'Book has been updated!');
          // ubah lagi teks tombol submit menjadi semula
          this.textContent = 'add book';
          // bwrsihkan value dari form 
          clear();
          // load data yang ada pada localstorage
          loadBook();
          /*
            jadikan parameter "index" sebagai null untuk 
            mencegah adanya data yang terduplikat nantinya
          */
          index = null;
          
        }
        
      }
    });
  }
  
});