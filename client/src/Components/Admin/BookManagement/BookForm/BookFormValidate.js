export function bookFormValidate(bookData,updating) {
    const {
        title, author, category, genre, description, images, publicationDate, ISBN, formats
    } = bookData;

    if (title.trim() === "") {
        return { success: false, message: "Please enter a title" };
    }

    if (images.length < 3 && !updating) {
        return { success: false, message: "Please upload at least 3 images" };
    }

    if (!formats.physical.isToggled && !formats.ebook.isToggled && !formats.audiobook.isToggled) {
        return { success: false, message: "Please select at least one format" };
    }

    if (formats.physical.isToggled) {
        if (!formats.physical.price || formats.physical.price <= 0) {
            return { success: false, message: "Please provide a valid price for Physical Book format" };
        }
        if (!formats.physical.stock || formats.physical.stock <= 0) {
            return { success: false, message: "Please provide a valid stock for Physical Book format" };
        }
    }

    if (formats.ebook.isToggled) {
        if (!formats.ebook.price || formats.ebook.price <= 0) {
            return { success: false, message: "Please provide a valid price for eBook format" };
        }
        if (!formats.ebook.fileUrl || formats.ebook.fileUrl.trim() === "") {
            return { success: false, message: "Please provide a valid File URL for eBook format" };
        }
        if (!formats.ebook.fileSize || formats.ebook.fileSize <= 0) {
            return { success: false, message: "Please provide a valid File Size for eBook format" };
        }
    }

    if (formats.audiobook.isToggled) {
        if (!formats.audiobook.price || formats.audiobook.price <= 0) {
            return { success: false, message: "Please provide a valid price for Audiobook format" };
        }
        if (!formats.audiobook.duration || formats.audiobook.duration.trim() === "") {
            return { success: false, message: "Please provide a valid duration for Audiobook format" };
        }
        if (!formats.audiobook.fileUrl || formats.audiobook.fileUrl.trim() === "") {
            return { success: false, message: "Please provide a valid File URL for Audiobook format" };
        }
    }

    if (!author || author.trim() === "") {
        return { success: false, message: "Please enter the author name" };
    }
    if (!category || category.trim() === "") {
        return { success: false, message: "Please enter the category" };
    }
    if (!genre || genre.trim() === "") {
        return { success: false, message: "Please enter the genre" };
    }
    if (!description || description.trim() === "") {
        return { success: false, message: "Please provide a description" };
    }
    if (!publicationDate) {
        return { success: false, message: "Please enter the publication date" };
    }
    if (!ISBN || ISBN.trim() === "") {
        return { success: false, message: "Please enter the ISBN" };
    }

    return { success: true, message: "Validation passed" };
}
