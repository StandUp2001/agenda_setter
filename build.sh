if [ -z "$1" ]; then
    echo "Usage: ./build.sh <command>"
    echo "Commands:"
    echo "  build: Build the project"
    exit 1
fi

command=$1
case $command in
    "build")
        echo "Building the project"
        build_folder="agenda_extension"
        mkdir -p $build_folder
        cp background.js $build_folder/
        cp manifest.json $build_folder/
        cp -r icons $build_folder/
        zip -r $build_folder.zip $build_folder
        rm -rf $build_folder
    ;;
    "clean")
        echo "Cleaning the project"
        rm -rf agenda_extension
        rm -f agenda_extension.zip
    ;;
    *)
        echo "Unknown command"
        exit 1
    ;;
esac